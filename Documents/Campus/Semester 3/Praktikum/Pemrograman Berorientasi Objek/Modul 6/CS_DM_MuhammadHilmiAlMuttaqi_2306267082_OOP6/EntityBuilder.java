public class EntityBuilder {
    private String name;
    private int health, damage, level;
    private AttackType attackType;
    private ClassType classType;
    private float moveSpeed;

    public EntityBuilder setName(String name) {
        this.name = name;
        return this;
    }

    public EntityBuilder setHealth(int health) {
        this.health = health;
        return this;
    }

    public EntityBuilder setDamage(int damage) {
        this.damage = damage;
        return this;
    }

    public EntityBuilder setLevel(int level) {
        this.level = level;
        return this;
    }

    public EntityBuilder setAttackType(AttackType attackType) {
        this.attackType = attackType;
        return this;
    }

    public EntityBuilder setClassType(ClassType classType) {
        this.classType = classType;
        return this;
    }

    public EntityBuilder setMoveSpeed(float moveSpeed) {
        this.moveSpeed = moveSpeed;
        return this;
    }

    public void reset() {
        this.health = 0;
        this.damage = 0;
        this.level = 0;
        this.attackType = null;
        this.classType = null;
        this.moveSpeed = 0f;
    }

    public Entity build() {
        return new Entity(name, health, damage, level, attackType, classType, moveSpeed);
    }
}
