package mpp.clearncleancity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = {"mpp.clearncleancity.repository"})
public class ClearNCleanCityApplication {
	public static void main(String[] args) {
		SpringApplication.run(ClearNCleanCityApplication.class, args);
	}
}
