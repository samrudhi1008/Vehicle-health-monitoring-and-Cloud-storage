from django.db import models

class Bike(models.Model):
    model_name = models.CharField(max_length=255)
    number_plate = models.CharField(max_length=255)
    assigned_driver = models.CharField(max_length=255)

    def __str__(self):
        return self.model_name
