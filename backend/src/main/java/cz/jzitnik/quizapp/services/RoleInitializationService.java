package cz.jzitnik.quizapp.services;

import cz.jzitnik.quizapp.entities.ERole;
import cz.jzitnik.quizapp.entities.Role;
import cz.jzitnik.quizapp.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class RoleInitializationService {

    private final RoleRepository roleRepository;

    @Autowired
    public RoleInitializationService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @PostConstruct
    public void initializeRoles() {
        for (ERole eRole : ERole.values()) {
            if (!roleRepository.findByName(eRole).isPresent()) {
                Role role = new Role(eRole);
                roleRepository.save(role);
            }
        }
    }
}
