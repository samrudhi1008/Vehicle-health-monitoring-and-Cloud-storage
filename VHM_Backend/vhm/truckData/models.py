from django.db import models

class Truck(models.Model):
    model_name = models.CharField(max_length=100)
    number_plate = models.CharField(max_length=20)
    assigned_driver = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.model_name} - {self.number_plate}"
