package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import Tarea4.avisos.calificacion.models.Foto;

import java.util.List;

public interface FotoRepository extends JpaRepository<Foto, Integer> {
    List<Foto> findByAvisoId(Integer avisoId);
}
