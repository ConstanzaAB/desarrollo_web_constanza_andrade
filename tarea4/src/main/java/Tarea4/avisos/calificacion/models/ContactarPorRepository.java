package Tarea4.avisos.calificacion.models;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ContactarPorRepository extends JpaRepository<ContactarPor, Integer> {
    List<ContactarPor> findByAvisoId(Integer avisoId);
}