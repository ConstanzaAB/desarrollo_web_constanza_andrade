package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Tarea4.avisos.calificacion.models.Region;

public interface RegionRepository extends JpaRepository<Region, Integer> {
}
