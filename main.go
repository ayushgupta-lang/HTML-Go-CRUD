package main

import (
	"github.com/gin-gonic/gin"
	"github.com/html-go-crud/database"
	"github.com/html-go-crud/models"
	"gorm.io/gorm"
)

var DB *gorm.DB

func main() {
	r := gin.Default()

	database.InitDatabase()
	database.Migrate()

	// Serve static files (HTML and JS)
	r.Static("/static", "./static")

	r.POST("/submit", func(c *gin.Context) {
		var user models.User
		c.Bind(&user)
		database.DB.Create(&user)
		c.JSON(200, gin.H{"message": "Form data submitted successfully"})
	})

	r.PATCH("/edit/:id", func(c *gin.Context) {
		id := c.Param("id")
		var user models.User
		if err := database.DB.First(&user, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}
		c.BindJSON(&user)
		database.DB.Save(&user)
		c.JSON(200, gin.H{"message": "User updated successfully"})
	})

	r.DELETE("/delete/:id", func(c *gin.Context) {
		id := c.Param("id")
		var user models.User
		if err := database.DB.First(&user, id).Error; err != nil {
			c.JSON(404, gin.H{"error": "User not found"})
			return
		}
		database.DB.Delete(&user)
		c.JSON(200, gin.H{"message": "User deleted successfully"})
	})

	// Add route to serve HTML file
	r.GET("/", func(c *gin.Context) {
		c.File("static/index.html")
	})

	r.Run(":8080")
}
