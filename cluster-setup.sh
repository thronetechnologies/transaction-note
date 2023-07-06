#!/bin/bash
[[ -f install.sh ]] && . install.sh || exit
cluster_mode=$1
release_name=transfernow

installing_cluster_objects() {
  echo Minikube started successfully!
  install_cluster_object
}

alter_minikube_start_cmd() {
  echo -e "Enter start command: \c"
  read command
  $command
  if [ $? -eq 0 ] 
    then
      installing_cluster_objects
    else
    echo Minikube failed to start! Try running this script again
    exit
  fi
}

run_default_start_cmd() {
  $([[ "$OSTYPE" == "darwin"* ]] && echo minikube start --memory 9216 --driver qemu --network socket_vmnet || echo minikube start --memory 9216)
  if [ $? -eq 0 ] 
  then
    installing_cluster_objects
    sleep 10
    run_install_release_cmd "service-chart" "$release_name"
  else
    echo Minikube failed to start! Try running this script again
    exit
  fi
}

run_minikube_start_cmd() {
  local command=$([[ "$OSTYPE" == "darwin"* ]] && echo "\$ minikube start --memory 9216 --driver qemu --network socket_vmnet" || echo "\$ minikube start --memory 9216")
  echo "Minikube is not running"
  sleep 2
  echo "Minikube will run with the default command $command"
  echo -e "Do you want to alter the minikube start command? [y/N]: \c"
  read response
  case $response in
    "y" | "yes" | "Yes" | "Y" )
      echo Yes
      alter_minikube_start_cmd
      ;;
    "n" | "no" | "No" | " N" )
      echo No
      run_default_start_cmd
      ;;
    * )
      echo Unknown response. Type either "Yes/yes/Y/y" or "No/no/N/n"
    esac
}
is_minikube_running_cmd() {
  running_cmd=$(minikube status | grep "apiserver: Running")
  if [ $? -eq 0 -a "$running_cmd" == "apiserver: Running" ] 
  then 
    echo "Minikube running"
    echo -e "Do you want to restart the cluster?:\c"
    read value
    case $value in
      "y" | "yes" | "Yes" | "Y" )
        echo Yes
        alter_minikube_start_cmd
        ;;
      "n" | "no" | "No" | "N" )
        echo No
        echo "Starting installation of cluster object"
        install_cluster_object
        ;;
      * )
        echo Unknown response. Type either "Yes/yes/Y/y" or "No/no/N/n"
    esac
  else
    run_minikube_start_cmd
  fi
}

start_minikube() {
  # check if minikube is installed
  m_version=$(minikube version)
  # check if minikube is installed operation was successful
  if [ $? = 0 ]
  then 
    echo $m_version
    is_minikube_running_cmd
  else
    # action for else block
    echo -e "Minikube is not installed! \e]8;;https://minikube.sigs.k8s.io/docs/start/\e\\Install minikube\e]8;;\e\\"
  fi
}
readonly -f start_minikube
readonly -f is_minikube_running_cmd
readonly -f run_minikube_start_cmd
readonly -f run_default_start_cmd
readonly -f alter_minikube_start_cmd
readonly -f installing_cluster_objects

if [ -d $cluster_directory ] 
then
  if [ $# -ne 0 ] 
    then
      echo "Running in cluster mode - Minikube"
      start_minikube
    else
      echo "Running in default mode - Docker compose"
  fi
else
  echo "$cluster_directory directory could not be found."
fi
