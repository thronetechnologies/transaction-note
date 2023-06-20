{{/* Generate namespace depending on the value of .development */}}
{{- define "service-chart.v0.namespace" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
namespace: default
{{- end -}}

{{/* Generate label for deployment and service for api-gateway */}}
{{- define "service-chart.v0.selector" -}}
app: {{ .name }}
{{- end -}}

{{/* Generate imagePullSecret */}}
{{- define "service-chart.v0.imagePullSecret" -}}
imagePullSecrets:
  - name: myregistrykey
{{- end -}}

{{/* Generate metadata names and namespace for */}}
{{- define "service-chart.v0.metadata" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
name: {{ cat $.Release.Name $arg.name | replace " " "-" }}
{{ include "service-chart.v0.namespace" (list $ $.Values.services) }}
{{- end -}}

{{/* Generate strategy for deployments */}}
{{- define "service-chart.v0.strategy" -}}
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
{{- end -}}

{{- define "service-chart.v0.ext-secrets" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
{{- range $arg.secrets }}
- name: {{ . | upper}}
  valueFrom:
    secretKeyRef:
      name: {{$.Values.services.externalSecret.secretTarget}}
      key: {{ . | upper}}
{{- end }}
{{- end -}}
