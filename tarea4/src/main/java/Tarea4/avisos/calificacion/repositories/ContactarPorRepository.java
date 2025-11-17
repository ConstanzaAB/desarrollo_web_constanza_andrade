package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Tarea4.avisos.calificacion.models.ContactarPor;

import java.util.List;

public interface ContactarPorRepository extends JpaRepository<ContactarPor, Integer> {
    List<ContactarPor> findByAvisoId(Integer avisoId);
}