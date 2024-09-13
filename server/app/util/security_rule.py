class SecurityRule:

    @staticmethod
    def detect_sql_injection(input_data: str) -> bool:
        dangerous_keywords = ["SELECT", "INSERT", "DELETE", "UPDATE", "DROP", "UNION"]
        for keyword in dangerous_keywords:
            if keyword.lower() in input_data.lower():
                return True
        return False

    @staticmethod
    def detect_xss(input_data: str) -> bool:
        xss_patterns = ["<script>", "javascript:", "onload=", "onerror="]
        for pattern in xss_patterns:
            if pattern.lower() in input_data.lower():
                return True
        return False

    @staticmethod
    def detect_path_traversal(input_data: str) -> bool:
        if "../" in input_data or "..\\" in input_data:
            return True
        return False
    
    @staticmethod
    def detect_command_injection(input_data: str) -> bool:
        dangerous_chars = ["&&", "|", ";", ">", "$", "`", "\\"]
        for char in dangerous_chars:
            if char in input_data:
                return True
        return False