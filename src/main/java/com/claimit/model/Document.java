package com.claimit.model;

import jakarta.persistence.*;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(name = "name_te")
    private String nameTe;

    private String description;

    @Column(name = "is_mandatory_default")
    private Boolean isMandatoryDefault = true;

    public Document() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNameTe() {
        return nameTe;
    }

    public void setNameTe(String nameTe) {
        this.nameTe = nameTe;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsMandatoryDefault() {
        return isMandatoryDefault;
    }

    public void setIsMandatoryDefault(Boolean isMandatoryDefault) {
        this.isMandatoryDefault = isMandatoryDefault;
    }
}
