<template>
  <div class="container">
    <h2 class="text-center">Saludtools Fullstack Challenge</h2>
    <p>
      En esta prueba técnica, se requiere diseñar una aplicación para administrar pacientes y sus prescripciones de medicamentos. 
    </p>
    <h4>Reglas de negocio:</h4>
    <b-list-group class="mb-3">
      <b-list-group-item>Todos los campos en la creación de pacientes son obligatorios.</b-list-group-item>
      <b-list-group-item>El medicamento solo puede ser prescrito al género correspondiente.</b-list-group-item>
      <b-list-group-item>No se puede prescribir más de 3 medicamentos por mes al mismo paciente.</b-list-group-item>
      <b-list-group-item>No se puede prescribir el mismo medicamento dentro del mismo mes al mismo paciente.</b-list-group-item>
      <b-list-group-item>Considerar la edad de consumo para la prescripción (descrita en el json de medicamentos).</b-list-group-item>
    </b-list-group>
    <h4>Instrucciones de uso:</h4>
    <p>
      Entre al módulo de pacientes y tendrá acceso a los siguientes botones:
    </p>
    <b-list-group>
      <b-list-group-item>Crear paciente</b-list-group-item>
      <b-list-group-item>Editar paciente</b-list-group-item>
      <b-list-group-item>Ver prescripciones</b-list-group-item>
      <b-list-group-item>Prescribir medicamentos</b-list-group-item>
    </b-list-group>
  </div>
</template>
