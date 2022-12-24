package transpiler

import (
	"errors"

	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
	"github.com/junioryono/ProUML/backend/sdk"
	java "github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
)

func ToJson(sdkP *sdk.SDK, projectId string, jwt string) ([]byte, error) {
	userUUID, err := sdkP.Postgres.Auth.GetUserIdFromToken(jwt)
	if err != nil {
		return handleError(err)
	}

	projectId, err = validateProjectId(sdkP, projectId, userUUID)
	if err != nil {
		return handleError(err)
	}

	files, err := downloadProject(sdkP, projectId)
	if err != nil {
		return handleError(err)
	}

	language, err := getProjectLanguage(files)
	if err != nil {
		return handleError(err)
	}

	parsedProject, err := parseProjectByLanguage(language, files)
	if err != nil {
		return handleError(err)
	}

	jsonResponse, err := jsoniter.Marshal(types.Status{
		Success:  true,
		Response: &parsedProject,
	})
	if err != nil {
		return handleError(err)
	}

	return jsonResponse, nil
}

// Handle all errors inside ToJSON() function
func handleError(err error) ([]byte, error) {
	jsonResponse, mErr := jsoniter.Marshal(types.Status{
		Success: false,
		Reason:  err.Error(),
	})

	if mErr != nil {
		return jsonMarshalError()
	}

	return jsonResponse, nil
}

// Handle JSON Marshal errors
func jsonMarshalError() ([]byte, error) {
	var (
		response []byte
		err      error
	)

	response, err = jsoniter.Marshal(types.Status{
		Success: false,
		Reason:  "Internal Error. Could not marshal JSON.",
	})

	if err != nil {
		return []byte{}, err
	}

	return response, nil
}

// Check if projectId belongs to user.
// If projectId is not specified, generate a new one and assign it to user.
func validateProjectId(sdkP *sdk.SDK, projectId string, userUUID string) (string, error) {
	if projectId == "" {
		// Generate projectId
		projectId := uuid.New().String()
		_ = projectId // temp - will be deleted later

		// Insert new row into table with this projectId
		// SupabaseClient.DB.From("document").Insert()

		return projectId, nil
	}

	// Query projectId and SELECT owner
	var DocumentQueryResult map[string]interface{}
	// err := cgn.DB.From("document").Select("id").Eq("owner", userUUID).Execute(&DocumentQueryResult)
	err := errors.New("error")
	if err != nil {
		return "", err
	}

	// Loop over DocumentQueryResult to see if projectId is in there
	exists := projectIdExists(projectId, DocumentQueryResult)
	if !exists {
		return "", errors.New("user does not have access to this project")
	}

	return projectId, nil
}

// Check if projectId exists in map
func projectIdExists(projectId string, queryResults map[string]interface{}) bool {
	for _, element := range queryResults {
		if element == projectId {
			return true
		}
	}

	return false
}

func downloadProject(sdkP *sdk.SDK, projectId string) ([]types.File, error) {
	// Download {projectId}.zip project from "projects" bucket
	// supabase.Storage.From("").Download("")

	// DELETE THIS AFTER DOWNLOAD IMPLEMENTATION IS COMPLETE
	// Test files
	file1 := types.File{
		Name:      "Test",
		Extension: "java",
		Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
	}
	file2 := types.File{
		Name:      "Test2",
		Extension: "java",
		Code:      []byte("public class Test2 { public void test(){ System.out.println('test2'); } }"),
	}
	files := []types.File{file1, file2}

	return files, nil
}

func getProjectLanguage(files []types.File) (string, error) {
	var language string

	// Figure out which language is being used based on file extension
	language = "java"

	return language, nil
}

func parseProjectByLanguage(language string, files []types.File) (types.Project, error) {
	// Call transpilation of specified language
	switch language {
	case "java":
		return java.ParseProject(files), nil
	case "cpp", "go", "js", "ts", "html", "css", "py", "cs", "php", "swift", "vb":
		// Covers C++, Go, JavaScript, TypeScript, HTML, CSS, Python , C#, PHP, Swift, Visual Basic
		return types.Project{}, errors.New("this is an unsupported language")
	default:
		return types.Project{}, errors.New("could not figure out which language was used")
	}
}
