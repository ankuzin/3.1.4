package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @GetMapping
    public String showAdminPanel(Model model) {
        model.addAttribute("newUser", new User());
        return "adminPanel";
    }


}