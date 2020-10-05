from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)
    def __str__(self):
        return self.name

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    notes=models.TextField()
    catergory = models.ForeignKey(
        Category, related_name="ingredients", on_delete=models.CASCADE
    )
    
    def __str__(self):
        return self.name

class Company(models.Model):
    name = models.CharField(max_length=100)
    pe_ratio = models.FloatField()
    ten_year_price = models.FloatField()
    growth_rate_wsj = models.FloatField()
    growth_rate_yahoo = models.FloatField()
    ttm_eps = models.FloatField()
    future_pe_ratio_calculated = models.FloatField()
    future_pe_ratio_analyst = models.FloatField()
    website = models.TextField()
    sp_500 = models.BooleanField()
    dow_jones = models.BooleanField()
    nasdaq_composite = models.BooleanField()
    russell_2000 = models.BooleanField()
    sector = models.TextField()
    tick = models.TextField()

    def __str__(self):
        return self.name
