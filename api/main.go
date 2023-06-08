package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
)

// Leave represents the structure of the leave form data
type Leave struct {
	ID        int    `json:"id"`
	Name      string `json:"name"`
	LeaveType string `json:"leaveType"`
	FromDate  string `json:"fromDate"`
	ToDate    string `json:"toDate"`
	Team      string `json:"team"`
	FilePath  string `json:"filePath"`
	Reporter  string `json:"reporter"`
}

var db *sql.DB

func main() {
	// Database connection setup
	var err error
	db, err = sql.Open("postgres", "host=localhost port=5432 user=postgres password=manish dbname=postgres sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Gin router setup
	router := gin.Default()

	// CORS configuration
	router.Use(cors.Default())

	// API routes setup
	router.GET("/getleave", getLeaveData)
	router.POST("/postleave", saveLeaveData)
	router.GET("/leaveTypes", handleLeaveTypesAPI)

	// Start the server
	log.Println("Server listening on http://localhost:3000")
	log.Fatal(router.Run(":3000"))
}

func getLeaveData(c *gin.Context) {
	rows, err := db.Query("SELECT * FROM leaves")
	if err != nil {
		log.Println("Error executing SQL query:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}
	defer rows.Close()

	var leaves []Leave

	for rows.Next() {
		var leave Leave
		err := rows.Scan(&leave.ID, &leave.Name, &leave.LeaveType, &leave.FromDate, &leave.ToDate, &leave.Team, &leave.FilePath, &leave.Reporter)
		if err != nil {
			log.Println("Error scanning row:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
			return
		}
		leaves = append(leaves, leave)
	}

	log.Println("Leave data retrieved successfully:", leaves)

	c.JSON(http.StatusOK, leaves)
}

func saveLeaveData(c *gin.Context) {
	var leave Leave

	err := c.Request.ParseMultipartForm(0)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	leave.Name = c.Request.FormValue("name")
	leave.LeaveType = c.Request.FormValue("leaveType")
	leave.FromDate = c.Request.FormValue("fromDate")
	leave.ToDate = c.Request.FormValue("toDate")
	leave.Team = c.Request.FormValue("team")
	leave.Reporter = c.Request.FormValue("reporter")

	// Save the leave data to the database
	_, err = db.Exec("INSERT INTO leaves (name, leave_type, from_date, to_date, team, reporter) VALUES ($1, $2, $3, $4, $5, $6)",
		leave.Name, leave.LeaveType, leave.FromDate, leave.ToDate, leave.Team, leave.Reporter)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error"})
		return
	}

	c.Status(http.StatusCreated)
}

func handleLeaveTypesAPI(c *gin.Context) {
	leaveTypes := []string{"Casual Leave", "Earned Leave", "Sick Leave"}
	c.Header("Access-Control-Allow-Origin", "*")
	c.JSON(http.StatusOK, gin.H{"leaveTypes": leaveTypes})
}
