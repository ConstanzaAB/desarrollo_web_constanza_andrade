package Tarea4.avisos.calificacion.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NavegacionController {

    // Redirige la raíz a /avisos
    @GetMapping("/")
    public String redirigirInicio() {
        return "redirect:/avisos";
    }

    // Otras páginas simples
    @GetMapping("/agregar")
    public String agregar() {
        return "agregar";
    }

    @GetMapping("/ver")
    public String ver() {
        return "ver";
    }

    @GetMapping("/estadisticas")
    public String estadisticas() {
        return "estadisticas";
    }
}
