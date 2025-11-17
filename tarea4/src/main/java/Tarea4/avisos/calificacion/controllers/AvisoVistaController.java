package Tarea4.avisos.calificacion.controllers;

import Tarea4.avisos.calificacion.services.AvisoService;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("/avisos")
public class AvisoVistaController {

    private final AvisoService avisoService;

    public AvisoVistaController(AvisoService avisoService) {
        this.avisoService = avisoService;
    }

    @GetMapping
    public String verAvisos(Model model) {
        model.addAttribute("avisos", avisoService.obtenerAvisosConPromedio());
        return "avisos";
    }

    @PostMapping("/{id}/evaluar")
    @ResponseBody
    public ResponseEntity<?> evaluarAviso(@PathVariable Integer id, @RequestBody Map<String, Integer> data) {
        double promedio = avisoService.evaluarAviso(id, data.get("nota"));
        
        return ResponseEntity.ok(Map.of(
            "message", "Evaluación guardada correctamente",
            "promedio", promedio
        ));
    }
}
