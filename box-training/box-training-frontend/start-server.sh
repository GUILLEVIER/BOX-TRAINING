#!/bin/sh

# Script para iniciar el servidor de desarrollo de Angular
# Para el proyecto Box Training

echo "🚀 Iniciando servidor de desarrollo de Angular..."
echo "📍 Dirección: http://localhost:4200"
echo "🛠️ Modo: Desarrollo"
echo ""

# Cambiar al directorio del proyecto
cd /workspaces/BOX-TRAINING/box-training/box-training-frontend

# Iniciar el servidor de desarrollo
ng serve --host 0.0.0.0 --port 4200 --disable-host-check --open
