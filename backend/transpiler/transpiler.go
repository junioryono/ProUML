package transpiler

import (
	"errors"
	"fmt"

	"github.com/junioryono/ProUML/backend/sdk"
	"github.com/junioryono/ProUML/backend/transpiler/java"
	"github.com/junioryono/ProUML/backend/transpiler/types"
	httpTypes "github.com/junioryono/ProUML/backend/types"
)

var (
	SupportedLanguages   = []string{"java"}
	UnsupportedLanguages = []string{"cpp", "go", "js", "ts", "html", "css", "py", "cs", "php", "swift", "vb"}
)

func ToJson(sdkP *sdk.SDK, files []types.File) (*types.Project, *httpTypes.WrappedError) {
	language, err := getProjectLanguage(files)
	if err != nil {
		return nil, err
	}

	// Remove files that are not supported
	for i := 0; i < len(files); i++ {
		if files[i].Extension != language {
			files = append(files[:i], files[i+1:]...)
			i--
		}
	}

	// Print all file names and code
	for _, file := range files {
		fmt.Println(file.Name)

		for _, line := range file.Code {
			fmt.Print(string(line))
		}
	}

	parsedProject, err := parseProjectByLanguage(language, files)
	if err != nil {
		return nil, err
	}

	return parsedProject, nil
}

func getProjectLanguage(files []types.File) (string, *httpTypes.WrappedError) {
	var language string

	// Iterate through files to find the language
	// Use a map to store the languages found and how many times they were found
	languagesMap := make(map[string]int)

	for _, file := range files {
		// Increment language count
		languagesMap[file.Extension]++
	}

	// Iterate through languagesMap and find the language that is used the most
	var mostUsedLanguage string
	var mostUsedLanguageCount int

	for key, value := range languagesMap {
		if value > mostUsedLanguageCount {
			mostUsedLanguage = key
			mostUsedLanguageCount = value
		}
	}

	// If the language that is used the most is used more than 50% of the time, return that language
	if mostUsedLanguageCount > (len(files) / 2) {
		language = mostUsedLanguage
		return language, nil
	}

	// If the language that is used the most is not used more than 50% of the time, return an error
	return "", httpTypes.Wrap(errors.New("could not figure out which language was used"), httpTypes.ErrCouldNotFigureOutLang)

}

func parseProjectByLanguage(language string, files []types.File) (*types.Project, *httpTypes.WrappedError) {
	// Call transpilation of specified language
	switch language {
	case "java":
		return java.ParseProject(files), nil
	case contains(UnsupportedLanguages, language):
		// Covers C++, Go, JavaScript, TypeScript, HTML, CSS, Python , C#, PHP, Swift, Visual Basic
		return nil, httpTypes.Wrap(errors.New("this is an unsupported language"), httpTypes.ErrUnsupportedLang)
	default:
		return nil, httpTypes.Wrap(errors.New("could not figure out which language was used"), httpTypes.ErrCouldNotFigureOutLang)
	}
}

func contains(s []string, e string) string {
	for _, a := range s {
		if a == e {
			return e
		}
	}

	return ""
}

// // Check if projectId belongs to user.
// // If projectId is not specified, generate a new one and assign it to user.
// func validateProjectId(sdkP *sdk.SDK, projectId string, userUUID string) (string, *httpTypes.WrappedError) {
// 	if projectId == "" {
// 		// Generate projectId
// 		projectId := uuid.New().String()
// 		_ = projectId // temp - will be deleted later

// 		// Insert new row into table with this projectId
// 		// SupabaseClient.DB.From("document").Insert()

// 		return projectId, nil
// 	}

// 	// Query projectId and SELECT owner
// 	var DocumentQueryResult map[string]interface{}
// 	// err := cgn.DB.From("document").Select("id").Eq("owner", userUUID).Execute(&DocumentQueryResult)
// 	err := errors.New("error")
// 	if err != nil {
// 		return "", httpTypes.Wrap(err, httpTypes.ErrInternalServerError)
// 	}

// 	// Loop over DocumentQueryResult to see if projectId is in there
// 	exists := projectIdExists(projectId, DocumentQueryResult)
// 	if !exists {
// 		return "", httpTypes.Wrap(errors.New("user does not have access to this project"), httpTypes.ErrNoDiagramsFound)
// 	}

// 	return projectId, nil
// }

// // Check if projectId exists in map
// func projectIdExists(projectId string, queryResults map[string]interface{}) bool {
// 	for _, element := range queryResults {
// 		if element == projectId {
// 			return true
// 		}
// 	}

// 	return false
// }

// func downloadProject(sdkP *sdk.SDK, projectId string) ([]types.File, *httpTypes.WrappedError) {
// 	// Download {projectId}.zip project from "projects" bucket
// 	// supabase.Storage.From("").Download("")

// 	// DELETE THIS AFTER DOWNLOAD IMPLEMENTATION IS COMPLETE
// 	// Test files
// 	file1 := types.File{
// 		Name:      "Test",
// 		Extension: "java",
// 		Code:      []byte("public class Test { public static void main(String args[]){ System.out.println('Hello Java'); } }"),
// 	}
// 	file2 := types.File{
// 		Name:      "Test2",
// 		Extension: "java",
// 		Code:      []byte("public class Test2 { public void test(){ System.out.println('test2'); } }"),
// 	}
// 	files := []types.File{file1, file2}

// 	return files, nil
// }
