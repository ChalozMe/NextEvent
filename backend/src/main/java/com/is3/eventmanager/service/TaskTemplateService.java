package com.is3.eventmanager.service;

import com.is3.eventmanager.entity.Event;
import com.is3.eventmanager.entity.Task;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class TaskTemplateService {

    public List<Task> generate(Event event) {

        List<Task> tasks = new ArrayList<>();

        switch (event.getType()) {

            case "Boda" ->
                    wedding(tasks, event);

            case "Quinceañero" ->
                    quince(tasks, event);

            default ->
                    business(tasks, event);
        }

        return tasks;
    }

    private void wedding(List<Task> tasks, Event event) {

        add(tasks, event, "Definir presupuesto", 180);
        add(tasks, event, "Reservar local", 170);
        add(tasks, event, "Contratar catering", 120);
        add(tasks, event, "Enviar invitaciones", 90);
        add(tasks, event, "Contratar fotógrafo", 80);
        add(tasks, event, "Elegir decoración", 60);
        add(tasks, event, "Confirmar invitados", 20);
        add(tasks, event, "Revisión final", 2);
    }

    private void quince(List<Task> tasks, Event event) {

        add(tasks, event, "Reservar salón", 150);
        add(tasks, event, "Vestido", 120);
        add(tasks, event, "Invitaciones", 90);
        add(tasks, event, "Coreografía", 70);
        add(tasks, event, "Decoración", 50);
        add(tasks, event, "Ensayo general", 5);
    }

    private void business(List<Task> tasks, Event event) {

        add(tasks, event, "Reservar auditorio", 90);
        add(tasks, event, "Contratar coffee break", 60);
        add(tasks, event, "Invitar asistentes", 45);
        add(tasks, event, "Preparar material", 20);
        add(tasks, event, "Prueba de equipos", 2);
    }

    private void add(List<Task> tasks,
                     Event event,
                     String title,
                     int daysBefore) {

        Task task = new Task();

        task.setEvent(event);

        task.setTitle(title);

        task.setStatus("PENDING");

        task.setPriority("MEDIUM");

        task.setPhase(daysBefore + " días antes");

        task.setDueDate(event.getEventDate().minusDays(daysBefore));

        task.setCreatedAt(LocalDateTime.now());

        tasks.add(task);
    }

}
