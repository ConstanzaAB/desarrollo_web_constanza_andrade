package Tarea4.avisos.calificacion.models;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Table(name = "region")
@Data
public class Region {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String nombre;

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private List<Comuna> comunas;
}
