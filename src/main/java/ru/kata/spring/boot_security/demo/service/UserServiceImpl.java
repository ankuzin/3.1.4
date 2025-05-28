package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import ru.kata.spring.boot_security.demo.model.Role;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.RoleRepository;
import ru.kata.spring.boot_security.demo.repository.UserRepository;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void createUserFromMap(Map<String, Object> payload) {
        String firstName = (String) payload.get("firstName");
        String lastName = (String) payload.get("lastName");
        Object ageObj = payload.get("age");
        int age = (ageObj instanceof Integer) ? (Integer) ageObj : ((Number) ageObj).intValue();
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");

        List<String> rolesStr = ((List<?>) payload.get("roles"))
                .stream()
                .map(Object::toString)
                .collect(Collectors.toList());

        Set<String> roles = new HashSet<>(rolesStr);

        createUser(firstName, lastName, age, email, password, roles);
    }

    private void createUser(String firstName, String lastName, int age, String email,
                            String password, Set<String> roleNames) {
        Set<Role> roles = getRolesByName(roleNames);
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAge(age);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(roles);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUserFromMap(Long id, Map<String, Object> payload) {
        String firstName = (String) payload.get("firstName");
        String lastName = (String) payload.get("lastName");
        int age = (Integer) payload.get("age");
        String email = (String) payload.get("email");
        String password = (String) payload.get("password");

        List<?> rolesRaw = (List<?>) payload.get("roles");
        Set<String> roles = rolesRaw.stream()
                .map(roleObj -> {
                    if (roleObj instanceof Map) {
                        return (String) ((Map<?, ?>) roleObj).get("name");
                    } else {
                        return roleObj.toString();
                    }
                })
                .collect(Collectors.toSet());

        updateUser(id, firstName, lastName, age, email, password, roles);
    }

    private void updateUser(Long id, String firstName, String lastName, int age, String email,
                            String password, Set<String> roleNames) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + id + " not found"));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setAge(age);
        user.setEmail(email);

        if (password != null && !password.isBlank()) {
            user.setPassword(passwordEncoder.encode(password));
        }

        user.setRoles(getRolesByName(roleNames));
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    private Set<Role> getRolesByName(Set<String> roleNames) {
        return roleNames.stream()
                .map(name -> roleRepository.findByName(name.startsWith("ROLE_") ? name : "ROLE_" + name))
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    @Override
    @Transactional
    public void updatePassword(User user, String rawPassword) {
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPassword(encodedPassword);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Override
    @Transactional
    public Set<Role> getAllRoles() {
        return new HashSet<>(roleRepository.findAll());
    }

    @Override
    @Transactional
    public void save(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }
}