package com.example.nghenhac.filter;

import com.example.nghenhac.component.JwtTokenUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.validation.constraints.NotNull;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
@Component
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final UserDetailsService userDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    @Override

    protected void doFilterInternal(@NotNull HttpServletRequest request,@NotNull HttpServletResponse response,@NotNull FilterChain filterChain) throws ServletException, IOException {
        final List<Pair<String,String>> bypassToken = Arrays.asList(
                Pair.of("/api/adduser","POST"),
                Pair.of("/login","POST"),
                Pair.of("/admin/recognizeSong","POST"),
                Pair.of("/recognizeSong","POST")
        );
        for (Pair<String,String> bypasstoken:bypassToken){
            if (request.getServletPath().contains(bypasstoken.getFirst())&&
                    request.getMethod().equals(bypasstoken.getSecond())) {
                filterChain.doFilter(request,response);
            }
        }
        try {
            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                final String token = authHeader.substring(7);
                final String email = jwtTokenUtil.extractEmail(token);
                if (email != null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                    if (jwtTokenUtil.validateToken(token,userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken= new UsernamePasswordAuthenticationToken(
                                userDetails,null,userDetails.getAuthorities()
                        );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    }
                }
                filterChain.doFilter(request,response);
            }
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED,"Unauthorized");
        }

    }
}
