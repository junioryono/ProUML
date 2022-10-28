package transpiler

import (
	"context"
	"os"

	"github.com/google/uuid"
	jsoniter "github.com/json-iterator/go"
	supabase "github.com/nedpals/supabase-go"
)

type Status struct {
	Success  bool   `json:"success"`
	Reason   string `json:"reason,omitempty"`
	Response []byte `json:"response,omitempty"`
}

func ToJson(SupabaseClient *supabase.Client, projectId string, jwt string) ([]byte, error) {
	var (
		language     string // Project language
		jsonResponse []byte // Response array of bytes (in JSON)
		err          error
	)

	// Check if user is authenticated
	authenticated, userUUID := getUser(SupabaseClient, jwt)
	if !authenticated {
		jsonResponse, err = jsoniter.Marshal(Status{
			Success: false,
			Reason:  "User is not authenticated.",
		})
		if err != nil {
			return jsonError()
		}
		os.Stdout.Write(jsonResponse)
		return jsonResponse, nil
	}

	if projectId == "" {
		// Generate projectId
		projectId := uuid.New().String()
		_ = projectId // temp - will be deleted later

		// Insert new row into table with this projectId
		// SupabaseClient.DB.From("document").Insert()
	} else {
		_ = userUUID // will delete this later

		// Query projectId and SELECT owner
		var DocumentQueryResult map[string]interface{}
		err = SupabaseClient.DB.From("document").Select("id").Eq("owner", userUUID).Execute(&DocumentQueryResult)
		if err != nil {
			jsonResponse, err = jsoniter.Marshal(Status{
				Success: false,
				Reason:  "Internal error. Could not execute query.",
			})
			if err != nil {
				return jsonError()
			}
			return jsonResponse, nil
		}

		// Loop over DocumentQueryResult to see if projectId is in there
		exists := projectIdExists(projectId, DocumentQueryResult)
		if !exists {
			jsonResponse, err = jsoniter.Marshal(Status{
				Success: false,
				Reason:  "User does not have access to this project.",
			})
			if err != nil {
				return jsonError()
			}
			return jsonResponse, nil
		}
	}

	// Download {projectId}.zip project from "projects" bucket
	// supabase.Storage.From("").Download("")

	// Figure out which language is being used based on file extension
	language = "java"

	// Call transpilation of specified language
	switch language {
	case "java":
		jsonResponse, err = jsoniter.Marshal(Status{
			Success: true,
		})
		if err != nil {
			return jsonError()
		}
	case "cpp", "go":
		jsonResponse, err = jsoniter.Marshal(Status{
			Success: false,
			Reason:  "This is an unsupported language.",
		})
		if err != nil {
			return jsonError()
		}
	default:
		jsonResponse, err = jsoniter.Marshal(Status{
			Success: false,
			Reason:  "Could not figure out which language was used.",
		})
		if err != nil {
			return jsonError()
		}
	}

	return jsonResponse, nil
}

// Handle JSON Marshal errors
func jsonError() ([]byte, error) {
	var (
		response []byte
		err      error
	)

	response, err = jsoniter.Marshal(Status{
		Success: false,
		Reason:  "Internal Error. Could not initialize JSON.",
	})

	if err != nil {
		return []byte{}, err
	}

	return response, nil
}

// Checks if user is authenticated
func getUser(sb *supabase.Client, jwt string) (bool, string) {
	user, err := sb.Auth.User(context.Background(), jwt)
	if err != nil || user.ID == "" {
		return false, ""
	}

	return true, user.ID
}

func projectIdExists(projectId string, queryResults map[string]interface{}) bool {
	for _, element := range queryResults {
		if element == projectId {
			return true
		}
	}

	return false
}
