package com.example.common.utils;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

public class SpecificationBuilder<T> {

    private final List<Predicate> predicates = new ArrayList<>();

    public SpecificationBuilder<T> like(Root<T> root, CriteriaBuilder cb, String field, String value) {
        if (value != null && !value.trim().isEmpty()) {
            predicates.add(cb.like(root.get(field), "%" + value + "%"));
        }
        return this;
    }

    // 🔥 keyword multi-field
    public SpecificationBuilder<T> keyword(Root<T> root, CriteriaBuilder cb, String keyword, String... fields) {
        if (keyword != null && !keyword.trim().isEmpty()) {
            List<Predicate> orPredicates = new ArrayList<>();

            for (String field : fields) {
                // chuyển cả field + keyword về lowercase
                orPredicates.add(cb.like(cb.lower(root.get(field)), "%" + keyword.toLowerCase() + "%"));
            }

            predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
        }
        return this;
    }

    public SpecificationBuilder<T> ge(Root<T> root, CriteriaBuilder cb, String field, Number value) {
        if (value != null) {
            predicates.add(cb.ge(root.get(field), value));
        }
        return this;
    }

    public SpecificationBuilder<T> le(Root<T> root, CriteriaBuilder cb, String field, Number value) {
        if (value != null) {
            predicates.add(cb.le(root.get(field), value));
        }
        return this;
    }

    public Predicate build(CriteriaBuilder cb) {
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}

