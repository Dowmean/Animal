from django.db import models

class Animal(models.Model):
    CATEGORY_CHOICES = [
        ('mammal', 'สัตว์เลี้ยงลูกด้วยนม'),
        ('reptile', 'สัตว์เลื้อยคลาน'),
        ('bird', 'สัตว์ปีก'),
        ('aquatic', 'สัตว์น้ำ'),
        ('amphibian', 'สะเทินน้ำสะเทินบก'),
    ]
    name = models.CharField(max_length=100, primary_key=True, verbose_name="ชื่อสัตว์")
    category = models.CharField(max_length=100, choices=CATEGORY_CHOICES, blank=True, null=True)
    scientific_name = models.CharField(max_length=100, verbose_name="ชื่อวิทยาศาสตร์", blank=True, null=True)
    photo = models.ImageField(upload_to='animals/photos/', blank=True, null=True)
    interest = models.TextField(max_length=3000, verbose_name="สิ่งที่น่าสนใจ", blank=True, null=True)
    habitat = models.CharField(max_length=1000, verbose_name="ถิ่นอาศัย", blank=True, null=True)
    food = models.CharField(max_length=1000, verbose_name="อาหาร", blank=True, null=True)
    behavior = models.TextField(max_length=1000, verbose_name="พฤติกรรม", blank=True, null=True)
    age = models.CharField(max_length=1000, verbose_name="อายุเฉลี่ย", blank=True, null=True)
    reproductive_age = models.CharField(max_length=1000, verbose_name="วัยเจริญพันธุ์", blank=True, null=True)
    size_weight = models.CharField(max_length=1000, verbose_name="ขนาดและน้ำหนัก", blank=True, null=True)

    def __str__(self):
        return self.name
