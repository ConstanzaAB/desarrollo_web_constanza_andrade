package Tarea4.avisos.calificacion.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByAvisoId(Integer avisoId);
}
