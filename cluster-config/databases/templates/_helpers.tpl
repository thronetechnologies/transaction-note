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

{{/* Generate metadata names and namespace for */}}
{{- define "service-chart.v0.metadata" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
name: {{ cat $.Release.Name $arg.name | replace " " "-" }}
{{ include "service-chart.v0.namespace" (list $ $.Values.services) }}
{{- end -}}

{{/* Generate metadata names and namespace for */}}
{{- define "service-chart.v0.servicemetadata" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
name: {{ $arg.name }}
{{ include "service-chart.v0.namespace" (list $ $.Values.services) }}
{{- end -}}

{{- define "service-chart.v0.ext-secrets-merge" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
{{- range $key, $val := $arg.secrets }}
- name: {{ $key | upper}}
  valueFrom:
    secretKeyRef:
      name: {{$.Values.services.externalSecret.secretTarget}}
      key: {{ $val | upper}}
{{- end }}
{{- end -}}