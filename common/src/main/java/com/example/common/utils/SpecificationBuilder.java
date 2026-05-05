package com.example.common.utils;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
public class SpecificationBuilder<T> {

    private final List<Predicate> predicates = new ArrayList<>();

    public SpecificationBuilder<T> keyword(
            Root<T> root,
            CriteriaBuilder cb,
            String keyword,
            String... fields) {
        if (keyword != null && !keyword.trim().isEmpty()) {

            List<Predicate> orPredicates = new ArrayList<>();

            for (String field : fields) {
                orPredicates.add(
                        cb.like(
                                cb.lower(root.get(field)),
                                "%" + keyword.toLowerCase() + "%"));
            }

            predicates.add(cb.or(orPredicates.toArray(new Predicate[0])));
        }

        return this;
    }

    public SpecificationBuilder<T> equal(
            Root<T> root,
            CriteriaBuilder cb,
            String field,
            Object value) {
        if (value != null) {
            predicates.add(cb.equal(root.get(field), value));
        }

        return this;
    }

    public SpecificationBuilder<T> joinEqualIgnoreCase(
            Root<T> root,
            CriteriaBuilder cb,
            String joinField,
            String targetField,
            String value) {
        if (value != null && !value.trim().isEmpty()) {
            predicates.add(
                    cb.equal(
                            cb.lower(root.join(joinField).get(targetField)),
                            value.toLowerCase()));
        }

        return this;
    }

    public SpecificationBuilder<T> ge(
            Root<T> root,
            CriteriaBuilder cb,
            String field,
            Number value) {
        if (value != null) {
            predicates.add(
                    cb.ge(
                            root.get(field),
                            value));
        }

        return this;
    }

    public SpecificationBuilder<T> le(
            Root<T> root,
            CriteriaBuilder cb,
            String field,
            Number value) {
        if (value != null) {
            predicates.add(
                    cb.le(
                            root.get(field),
                            value));
        }

        return this;
    }

    public Predicate build(CriteriaBuilder cb) {
        return cb.and(predicates.toArray(new Predicate[0]));
    }
}
