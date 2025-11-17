package Tarea4.avisos.calificacion.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import Tarea4.avisos.calificacion.models.Aviso;

import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional;
import java.util.List;

public interface AvisoRepository extends JpaRepository<Aviso, Integer> {
    @EntityGraph(attributePaths = {"fotos", "contactos", "comentarios", "notas", "comuna.region"})
    Optional<Aviso> findDetailedById(Integer id);

    @Query("SELECT a FROM Aviso a JOIN FETCH a.comuna c JOIN FETCH c.region")
    List<Aviso> findAllConComunaYRegion();
}

