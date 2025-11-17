package Tarea4.avisos.calificacion.services;
import Tarea4.avisos.calificacion.models.Aviso;
import Tarea4.avisos.calificacion.models.Nota;
import Tarea4.avisos.calificacion.repositories.AvisoRepository;
import Tarea4.avisos.calificacion.repositories.NotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.OptionalDouble;

@Service
public class AvisoService {

    private final AvisoRepository avisoRepo;
    private final NotaRepository notaRepo;

    public AvisoService(AvisoRepository avisoRepo, NotaRepository notaRepo) {
        this.avisoRepo = avisoRepo;
        this.notaRepo = notaRepo;
    }

    // Obtiene todos los avisos con su promedio de notas
    public List<Aviso> obtenerAvisosConPromedio() {
        List<Aviso> avisos = avisoRepo.findAllConComunaYRegion();
        
        for (Aviso aviso : avisos) {
            aviso.setPromedioNota(calcularPromedio(aviso.getId()));
        }
        
        return avisos;
    }

    // Guarda una nueva nota para un aviso y retorna el nuevo promedio
    public double evaluarAviso(Integer avisoId, int nota) {
        Aviso aviso = avisoRepo.findById(avisoId).orElseThrow();

        Nota nuevaNota = new Nota();
        nuevaNota.setNota(nota);
        nuevaNota.setAviso(aviso);
        notaRepo.save(nuevaNota);

        return calcularPromedio(avisoId);
    }

    // Calcula el promedio de notas para un aviso dado
    private double calcularPromedio(Integer avisoId) {
        OptionalDouble promedio = notaRepo.findByAvisoId(avisoId)
                .stream()
                .mapToInt(Nota::getNota)
                .average();

        if (promedio.isEmpty()) return -1.0;

        return Math.round(promedio.getAsDouble() * 10.0) / 10.0;
    }

}
