#!/bin/bash
cluster_directory="cluster-config"
cluster_override_directory="cluster-override-config"
directory_names=`ls ./$cluster_directory`
overide_arr=()

is_helm_installed() {
  check_status=$(helm version --short | grep "v")
  echo $check_status
  if [ $? -eq 0 ] && [[ $check_status == *"v"*  || $check_status == *"v3"* ]]
    then
      echo Helm is installed
  else
    printf "Helm is not installed. \e]8;;https://helm.sh/docs/intro/install/\e\\Install Helm\e]8;;\e\\\n"
    exit
  fi
}

install_releases() {
  cd $GITHUB_WORKSPACE/$cluster_directory
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
        if [[ $file == "cluster-override-config" || $file == "kube-prometheus-stack" || $file == "consul" || $file == "vault" || $file == "service-chart" ]]
        then 
          continue
        else
          run_install_release_cmd "$file"
        fi
      done
  else
    echo $cluster_override_directory does not exist
  fi
}

install_cluster_object 