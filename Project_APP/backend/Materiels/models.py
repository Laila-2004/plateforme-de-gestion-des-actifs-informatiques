from django.db import models

# Create your models here.
class Materiel(models.Model):
    name = models.CharField(max_length=100)
    date_achat = models.DateField()
    etat = models.CharField(max_length=50,choices=[('en_panne','En_panne'),('en_marche','En_marche'),('en_réparation','En_réparation'),('en_stock','En stock')],default='en_marche')
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
    impriment_type = models.CharField(max_length=50)
    def __str__(self):
        return self.name

class Telephone(Materiel):
    numero = models.CharField(max_length=20)
    telephone_type = models.CharField(max_length=50,choices=[('portable','Portable'),('bureau','Bureau')])
    def __str__(self):
        return self.name
    
class Serveur(Materiel):
    processeur = models.CharField(max_length=100)
    ram = models.CharField(max_length=50)
    stockage = models.CharField(max_length=100)
    systeme_exploitation = models.CharField(max_length=100)
    role = models.CharField(max_length=100)  # Ex : base de données, DNS, etc.
    ip_adresse = models.GenericIPAddressField(blank=True, null=True)

class Logiciel(Materiel):
    version = models.CharField(max_length=50)
    cle_licence = models.CharField(max_length=100)
    date_expiration = models.DateField(blank=True, null=True)
    systeme_compatible = models.CharField(max_length=100)  # Windows, Linux, etc.

class StockageExterne(Materiel):
    type_stockage = models.CharField(max_length=50)  # USB, SSD, HDD
    capacite = models.CharField(max_length=50)  # ex: 128 Go, 1 To

class Routeur(Materiel):
    ip_adresse = models.GenericIPAddressField(blank=True, null=True)
    nb_ports = models.IntegerField()
    vitesse = models.CharField(max_length=50)  # ex: 1 Gbps

# 🔹 Périphérique
class Peripherique(Materiel):
    TYPE_PERIPHERIQUE_CHOICES = [
        ('clavier', 'Clavier'),
        ('souris', 'Souris'),
        ('casque', 'Casque'),
        ('webcam', 'Webcam'),
        ('microphone', 'Microphone'),
        ('haut_parleur', 'Haut-parleur'),
        ('autre', 'Autre'),
    ]

    type_peripherique = models.CharField(max_length=50, choices=TYPE_PERIPHERIQUE_CHOICES)
    connectivite = models.CharField(max_length=100, blank=True, null=True)  # USB, Bluetooth, etc.
    compatible_os = models.CharField(max_length=100, blank=True, null=True)  # Windows, Mac, Linux...

   
