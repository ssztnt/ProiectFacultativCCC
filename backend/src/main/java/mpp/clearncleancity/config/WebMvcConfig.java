package mpp.clearncleancity.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private static final Logger log = LoggerFactory.getLogger(WebMvcConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        log.info("Registering resource handler for profile pictures");
        registry
                .addResourceHandler("/uploads/profile-pictures/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/profile-pictures/");

        log.info("Registering resource handler for issue pictures");
        registry
                .addResourceHandler("/uploads/issue-pictures/**")
                .addResourceLocations("file:" + System.getProperty("user.dir") + "/uploads/issue-pictures/");
    }
}