#!/bin/bash
cluster_directory="cluster-config"
cluster_override_directory="cluster-override-config"
directory_names=`ls ./$cluster_directory`
overide_arr=()

is_helm_installed() {
  check_status=$(helm version --short)
  echo $check_status
  if [ $? -eq 0 ]
    then
      echo Helm is installed
  else
    printf "Helm is not installed. \e]8;;https://helm.sh/docs/intro/install/\e\\Install Helm\e]8;;\e\\\n"
    exit
  fi
}

install_releases() {
  cd $cluster_directory
  if [ $? -eq 0 ]
    then
      if [[ " ${overide_arr[@]} " =~ " $1 " ]]
        then
          if [ $# -eq 2 ] 
            then 
              echo "helm install $2 ./$1 --values ./$cluster_override_directory/$1.yaml --atomic --debug"
              helm install $2 ./$1 --values ./$cluster_override_directory/$1.yaml --atomic --debug
          else
            echo "helm install $1 ./$f1 --values ./$cluster_override_directory/$1.yaml --atomic --debug"
            helm install $1 ./$1 --values ./$cluster_override_directory/$1.yaml --atomic --debug
          fi
      else
        if [ $# -eq 2 ] 
          then 
            echo "helm install $2 ./$1 --atomic --debug"
            helm install $2 ./$1 --atomic --debug
        else
          echo "helm install $1 ./$1 --atomic --debug"
          helm install $1 ./$1 --atomic --debug
        fi
      fi
      sleep 5
  fi
  cd ..
}

uninstall_and_install_release() {
  [[ $2 ]] && helm uninstall $2 || helm uninstall $1
  [[ $2 ]] && install_releases "$1" "$2" || install_releases "$1"
}

run_install_release_cmd() {
  [[ $2 ]] && status=$(helm status $2 | grep "STATUS: deployed") || status=$(helm status $1 | grep "STATUS: deployed")
  if [ $? -eq 0  -a "$status" == "STATUS: deployed" ]
    then 
      [[ $2 ]] && uninstall_and_install_release "$1" "$2" || uninstall_and_install_release "$1"
      # [[ $2 ]] && echo $2 is deployed || echo $1 is deployed 
    else
      [[ $2 ]] && echo "Deploying $2" || echo "Deploying $1"
      [[ $2 ]] && install_releases "$1" "$2" || install_releases "$1"
  fi
}

install_cluster_object() {
  echo "Preparing to install kubernetes objects..."
  if [ -d $cluster_directory ]
  then
    is_helm_installed
    override_files=`ls ./$cluster_directory/$cluster_override_directory/*.yaml`
    for item in $override_files
    do
      item=${item##*/}
      item=$item
      itemname="${item%.yaml}"
      overide_arr+=($itemname)
    done
      for file in $directory_names
      do
        if [[ $file == "cluster-override-config" || $file == "databases" ]]
        then 
          continue
        fi
        if [[ " ${overide_arr[@]} " =~ " $file " ]] 
        then 
          if [[ $file == "kube-prometheus-stack" ]]
            then
              run_install_release_cmd "$file" "monitoring"
            else
              run_install_release_cmd "$file"
          fi
        else 
          if [ $file == "service-chart" ] 
            then 
              continue
          fi
          run_install_release_cmd "$file"
        fi
      done
    # else
    #   echo Failed to change directory to $cluster_override_directory
    # fi
  else
    echo $cluster_override_directory does not exist
  fi
}


if [[ $BASH_SOURCE = $0 ]] 
then
  echo $BASH_SOURCE
  echo $0
  install_cluster_object 
else 
  echo $BASH_SOURCE
  echo $0
  echo "Script is being sourced"
fi


# && cd .. && kubectl exec vault-0 -- vault operator init -key-shares=1 -key-threshold=1 -format=json > cluster-keys.json && VAULT_UNSEAL_KEY=$(cat cluster-keys.json | jq -r ".unseal_keys_b64[]") && kubectl exec vault-0 -- vault operator unseal $VAULT_UNSEAL_KEY && kubectl exec vault-1 -- vault operator unseal $VAULT_UNSEAL_KEY && kubectl exec vault-2 -- vault operator unseal $VAULT_UNSEAL_KEY