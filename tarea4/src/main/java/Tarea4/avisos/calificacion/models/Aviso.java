package Tarea4.avisos.calificacion.models;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;


@Entity
@Table(name = "aviso_adopcion")
@Data 
public class Aviso {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_ingreso", nullable = false)
    private LocalDateTime fechaIngreso = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "comuna_id", nullable = false)
    private Comuna comuna;

    @Column(length = 100)
    private String sector;

    @Column(length = 200, nullable = false)
    private String nombre;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 15)
    private String celular;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAnimal tipo;

    @Column(nullable = false)
    private Integer cantidad;

    @Column(nullable = false)
    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(name = "unidad_medida", nullable = false)
    private UnidadEdad unidadMedida;

    @Column(name = "fecha_entrega", nullable = false)
    private LocalDateTime fechaEntrega;

    @Column(length = 500)
    private String descripcion;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Foto> fotos;

    @OneToMany(mappedBy = "aviso", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ContactarPor> contactos;

    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY)
    private List<Comentario> comentarios;

    @Transient  // no se guarda en la base de datos
    private Double promedioNota;

    public Double getPromedioNota() {
        return promedioNota;
    }

    public void setPromedioNota(Double promedioNota) {
        this.promedioNota = promedioNota;
    }
}