from django.db import models

class Lead(models.Model):
    name = models.CharField(max_length=100)
    mobile = models.CharField(max_length=15)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.mobile}"
    
    class Meta:
        ordering = ['-created_at']
