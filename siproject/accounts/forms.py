from django import forms
from .models import Animal
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True)

    class Meta:
        model = User
        fields = ("username", "email", "password1", "password2")

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user


class AnimalForm(forms.ModelForm):
    class Meta:
        model = Animal
        fields = '__all__'

# class AnimalForm(forms.ModelForm):
#     class Meta:
#         model = Animal
#         fields = ['name', 'scientific_name', 'photo', 'interest', 'habitat', 'food', 'behavior','age','reproductive_age','size_weight']

