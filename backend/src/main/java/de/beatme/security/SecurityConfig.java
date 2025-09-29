package de.beatme.security;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    /**
     * Filter, der Firebase-ID-Token prüft.
     * Erwartet im Header: Authorization: Bearer <token>
     */
    public static class FirebaseAuthFilter extends OncePerRequestFilter {

        @Override
        protected void doFilterInternal(HttpServletRequest request,
                                        HttpServletResponse response,
                                        FilterChain filterChain)
                throws ServletException, IOException {

            String header = request.getHeader("Authorization");

            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                try {
                    FirebaseToken decoded = FirebaseAuth.getInstance().verifyIdToken(token);

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    new User(decoded.getUid(), "", Collections.emptyList()),
                                    null,
                                    Collections.emptyList()
                            );
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                } catch (FirebaseAuthException e) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase token");
                    return;
                }
            }

            filterChain.doFilter(request, response);
        }
    }

    //Security-Konfiguration
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/users").permitAll()
                        .requestMatchers(HttpMethod.POST, "/groups/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/groups/*/challenges/*/vote").permitAll()
                        .requestMatchers(HttpMethod.GET, "/groups/*/challenges/*/results").permitAll()
                        .requestMatchers(HttpMethod.GET, "/groups/user/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/groups/join").permitAll()
                        .requestMatchers(HttpMethod.GET, "/challenges/group/**").permitAll()

                        // alles andere nur mit Token
                        .anyRequest().authenticated()
                )
                //Firebase-Filter kommt vor Username/Password
                .addFilterBefore(new FirebaseAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    //CORS-Config für Frontend
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5173",
                "http://localhost:5174",
                "https://localhost:5173/",
                "https://localhost:5174/"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setExposedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
