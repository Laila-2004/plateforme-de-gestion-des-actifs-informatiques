from rest_framework import serializers
from .models import App_User,Department,Service

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta :
        model = Department
        fields='__all__'
class ServiceSerializer(serializers.ModelSerializer):
    department = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all())
    department_details = DepartmentSerializer(source='department', read_only=True)
    class Meta :
        model= Service
        fields='__all__'

class App_UserSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    service_details = ServiceSerializer(source='service', read_only=True)

    class Meta :
        model = App_User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = App_User(**validated_data)
        user.set_password(password)
        user.save()
        return user
        
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance
