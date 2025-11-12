package Tarea4.avisos.calificacion.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FotoRepository extends JpaRepository<Foto, Integer> {
    List<Foto> findByAvisoId(Integer avisoId);
}
