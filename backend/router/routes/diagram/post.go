package diagram

import (
	"bytes"
	"io"
	"strings"

	"archive/zip"

	"github.com/gofiber/fiber/v2"
	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/templates"
	"github.com/junioryono/ProUML/backend/transpiler"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

func Post(sdkP *sdk.SDK) fiber.Handler {
	return func(fbCtx *fiber.Ctx) error {
		projectId := fbCtx.FormValue("projectId")

		// Check if user uploaded a project
		if project, err := fbCtx.FormFile("project"); err == nil {
			if project.Header.Get("Content-Type") != "zip" &&
				project.Header.Get("Content-Type") != "application/octet-stream" &&
				project.Header.Get("Content-Type") != "application/zip" &&
				project.Header.Get("Content-Type") != "application/x-zip" &&
				project.Header.Get("Content-Type") != "application/x-zip-compressed" {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  "Project must be compressed (zipped).",
				})
			}

			// If the file size is greater than 50MB, return error
			if project.Size > 50*1024*1024 {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  "Project must be less than 50MB.",
				})
			}

			f, err := project.Open()
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  "Could not open project file.",
				})
			}

			// Read file
			zipBytes := make([]byte, project.Size)
			lenZipBytes, err := f.Read(zipBytes)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  "Could not read project file.",
				})
			}

			f.Close()

			zipReader, err := zip.NewReader(bytes.NewReader(zipBytes), int64(lenZipBytes))
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  "Could not read project file.",
				})
			}

			var files []types.File

			// Read all the files from zip archive
			for _, zipFile := range zipReader.File {
				lastSlashIndex := strings.LastIndexByte(zipFile.Name, '/')

				// Get the file extension
				fileNameWithExtension := zipFile.Name[lastSlashIndex+1:]
				periodIndex := strings.IndexByte(fileNameWithExtension, '.')
				if periodIndex == -1 {
					continue
				}

				unzippedFileBytes, err := readZipFile(zipFile)
				if err != nil {
					continue
				}

				files = append(files, types.File{
					Name:      fileNameWithExtension[:periodIndex],
					Extension: fileNameWithExtension[periodIndex+1:],
					Code:      unzippedFileBytes,
				})
			}

			// Transpile files
			transpiledProject, err2 := transpiler.Transpile(sdkP, files)
			if err2 != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  err2.Error(),
				})
			}

			// Create a new diagram
			diagramId, err2 := sdkP.Postgres.Diagram.Create(fbCtx.Locals("idToken").(string), projectId, &transpiledProject)
			if err2 != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			return fbCtx.Status(fiber.StatusOK).JSON(httpTypes.Status{
				Success:  true,
				Response: diagramId,
			})
		}

		// Check if user wants to use a template
		if templateName := fbCtx.FormValue("template"); templateName != "" {
			// Get the template
			template, err := templates.GetTemplate(templateName)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			// Create a new diagram
			diagramId, err := sdkP.Postgres.Diagram.Create(fbCtx.Locals("idToken").(string), projectId, template)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			return fbCtx.Status(fiber.StatusOK).JSON(httpTypes.Status{
				Success:  true,
				Response: diagramId,
			})
		}

		if duplicateDiagramId := fbCtx.FormValue("duplicateDiagramId"); duplicateDiagramId != "" {
			// Duplicate the diagram
			diagramId, err := sdkP.Postgres.Diagram.Duplicate(fbCtx.Locals("idToken").(string), projectId, duplicateDiagramId)
			if err != nil {
				return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
					Success: false,
					Reason:  err.Error(),
				})
			}

			return fbCtx.Status(fiber.StatusOK).JSON(httpTypes.Status{
				Success:  true,
				Response: diagramId,
			})
		}

		// Create a new diagram
		diagramId, err := sdkP.Postgres.Diagram.Create(fbCtx.Locals("idToken").(string), projectId, nil)
		if err != nil {
			return fbCtx.Status(fiber.StatusBadRequest).JSON(httpTypes.Status{
				Success: false,
				Reason:  err.Error(),
			})
		}

		// User did not upload a project or use a template
		return fbCtx.Status(fiber.StatusOK).JSON(httpTypes.Status{
			Success:  true,
			Response: diagramId,
		})
	}
}

func readZipFile(zf *zip.File) ([]byte, error) {
	f, err := zf.Open()
	if err != nil {
		return nil, err
	}
	defer f.Close()
	return io.ReadAll(f)
}
