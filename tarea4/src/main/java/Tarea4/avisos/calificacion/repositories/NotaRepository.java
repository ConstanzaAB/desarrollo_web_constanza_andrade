package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Tarea4.avisos.calificacion.models.Nota;

import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    List<Nota> findByAvisoId(Integer avisoId);

    List<Nota> findByAvisoId(Long id);
}

