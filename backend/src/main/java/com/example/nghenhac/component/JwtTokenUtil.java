package com.example.nghenhac.component;

import com.example.nghenhac.Model.UsersEntity;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    private int expiration=2592000;
    public String generateToken(UsersEntity usersEntity) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("email",usersEntity.getEmail());
        try {String token= Jwts.builder()
                .setClaims(claims)
                .setSubject(usersEntity.getEmail())
                .setExpiration(new Date(System.currentTimeMillis()+expiration*1000L))
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
            return token;
        } catch(Exception e) {
            System.err.println("Cannot create JWT" +e.getMessage());
            return null;
        }

    }
    private Key getSignKey() {
        byte[] bytes = Decoders.BASE64.decode("sporitfucuaminhnehihihihihihihihihihihihihihihi");
        return Keys.hmacShaKeyFor(bytes);
    }
    private Claims extractAllClaim(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey()).build().parseClaimsJws(token).getBody();
    }
    private <T> T extractClaim(String token, Function<Claims,T> claimsResolver){
        final  Claims claims = this.extractAllClaim(token);
        return claimsResolver.apply(claims);
    }
    public boolean isTokenExpired(String token) {
        Date expirationDate = this.extractClaim(token,Claims::getExpiration);
        return expirationDate.before(new Date());
    }
    public String extractEmail(String token) {
        return extractClaim(token,Claims::getSubject);
    }
    public boolean validateToken(String token, UserDetails userDetails) {
        String email = extractEmail(token);
        return (email.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
