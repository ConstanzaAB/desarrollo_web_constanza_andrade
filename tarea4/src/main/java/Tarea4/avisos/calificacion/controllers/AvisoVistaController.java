package Tarea4.avisos.calificacion.controllers;

import Tarea4.avisos.calificacion.models.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.OptionalDouble;

@Controller
@RequestMapping("/avisos")
public class AvisoVistaController {

    private final AvisoRepository avisoRepo;
    private final NotaRepository notaRepo;

    public AvisoVistaController(AvisoRepository avisoRepo, NotaRepository notaRepo) {
        this.avisoRepo = avisoRepo;
        this.notaRepo = notaRepo;
    }

    // Mostrar tabla
    @GetMapping
    public String verAvisos(Model model) {
        List<Aviso> avisos = avisoRepo.findAllConComunaYRegion();

        for (Aviso aviso : avisos) {
            List<Nota> notas = notaRepo.findByAvisoId(aviso.getId());
            OptionalDouble promedio = notas.stream().mapToInt(Nota::getNota).average();
            aviso.setPromedioNota(promedio.isPresent() ? promedio.getAsDouble() : -1.0);
        }

        model.addAttribute("avisos", avisos);
        return "avisos"; // Nombre de tu plantilla Thymeleaf
    }

    @PostMapping("/{id}/evaluar")
    @ResponseBody
    public ResponseEntity<?> evaluarAviso(@PathVariable Integer id, @RequestBody Map<String, Integer> data) {
        int nota = data.get("nota");
        Aviso aviso = avisoRepo.findById(id).orElseThrow();

        // Guardar nueva nota
        Nota nuevaNota = new Nota();
        nuevaNota.setNota(nota);
        nuevaNota.setAviso(aviso);
        notaRepo.save(nuevaNota);

        // Calcular nuevo promedio
        List<Nota> notas = notaRepo.findByAvisoId(id);
        OptionalDouble promedio = notas.stream().mapToInt(Nota::getNota).average();
        double promedioNuevo = promedio.isPresent() ? Math.round(promedio.getAsDouble() * 10.0) / 10.0 : 0.0;

        return ResponseEntity.ok(Map.of(
            "message", "Evaluación guardada correctamente",
            "promedio", promedioNuevo
        ));
    }

}
