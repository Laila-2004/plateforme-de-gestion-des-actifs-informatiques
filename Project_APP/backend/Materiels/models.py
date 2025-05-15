from django.db import models

# Create your models here.
class Materiel(models.Model):
    name = models.CharField(max_length=100)
    date_achat = models.DateField()
    etat = models.CharField(max_length=50,choices=[('en_panne','En_panne'),('en_marche','En_marche'),('en_réparation','En_réparation')],default='en_marche')
    marque = models.CharField(max_length=100)
    assigned_to = models.ForeignKey('App_Users.App_User', on_delete=models.SET_NULL, null=True, blank=True)
    def __str__(self):
        return self.name

class Ordinateur(Materiel):
    system_exp = models.CharField(max_length=100)
    rom = models.CharField(max_length=50)
    ram = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Ecrant(Materiel):
    taille = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Impriment(Materiel):
    type = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Telephone(Materiel):
    numero = models.CharField(max_length=20)
    type = models.CharField(max_length=50,choices=[('portable','Portable'),('bureau','Bureau')])
    def __str__(self):
        return self.name