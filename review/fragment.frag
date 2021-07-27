#version 460 core

in vec3 Normal;
in vec3 FragPos;
in vec2 TexCoords;

out vec4 FragColor;

uniform vec3 objectColor;
uniform vec3 lightColor;
uniform vec3 lightPos;

uniform float matrixlight;
uniform float matrixmove;


struct Material {
    sampler2D diffuse;
    sampler2D specular;
    float shininess;
	sampler2D emission;
}; 

uniform Material material;

struct Light {
    vec3 position;

    vec3 ambient;
    vec3 diffuse;
    vec3 specular;
};

uniform Light light;

void main()
{
	//ao
	vec3 ambient = light.ambient * vec3(texture(material.diffuse, TexCoords));
	
	//diff
	vec3 norm = normalize(Normal);
	vec3 lightDir = normalize(lightPos - FragPos);
	float diff = max(dot(norm, lightDir), 0.0);
	vec3 diffuse = diff * light.diffuse * vec3( texture(material.diffuse, TexCoords));

	//spec
	vec3 viewDir = normalize( - FragPos);
	vec3 reflectDir = reflect(-lightDir, norm);
	float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
	vec3 specular = light.specular * spec * vec3(texture(material.specular, TexCoords));

	//emission
	vec3 emission = matrixlight * vec3(texture(material.emission, vec2(TexCoords.x, TexCoords.y + matrixmove)));

	vec3 result = ambient + diffuse + specular + emission;
	FragColor = vec4(result, 1.0);
}