package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Tarea4.avisos.calificacion.models.Comuna;

import java.util.List;

public interface ComunaRepository extends JpaRepository<Comuna, Integer> {
    List<Comuna> findByRegionId(Integer regionId);
}
