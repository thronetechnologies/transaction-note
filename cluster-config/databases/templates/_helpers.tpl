{{/* Generate namespace depending on the value of .development */}}
{{- define "service-chart.v0.namespace" -}}
{{- $ := index . 0 -}}
{{- $arg := index . 1 -}}
namespace: {{ $arg.namespace}}
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

{{/* Generate storage template for local env*/}}
{{- define "databases.v0.local-storages" -}}
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: {{ .storageName }}
provisioner: k8s.io/minikube-hostpath
reclaimPolicy: Retain 
volumeBindingMode: Immediate
{{- end -}}

{{/* Generate storage template for dev env*/}}
{{- define "databases.v0.dev-storages" -}}
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: {{ .storageName }}
provisioner: file.csi.azure.com
allowVolumeExpansion: true
mountOptions:
  - dir_mode=0777
  - file_mode=0777
  - uid=0
  - gid=0
  - mfsymlinks
  - cache=strict
  - actimeo=30
parameters:
  skuName: Premium_LRS
  location: eastus
{{- end -}}

{{/* Generate persistent volume claim template for local env*/}}
{{- define "databases.v0.dev-pvc" -}}
{{- $arg0 := index . 0 -}}
{{- $arg1 := index . 1 -}}
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ $arg0.pvcName}}
{{ include "service-chart.v0.namespace" (list $ $arg1) | indent 2 }}
spec:
  storageClassName: {{ $arg0.storageName}}
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ if eq $arg1.environment "local" }}1Gi{{ else if eq $arg1.environment "dev" }}{{ $arg0.storage }}{{ end }}
{{- end -}}