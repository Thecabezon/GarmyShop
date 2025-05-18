package com.garmyshop.user_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.garmyshop.user_backend.entity.Color;

public interface ColorRepository extends JpaRepository<Color, Long> {

}
