---
name: supabase
description: Supabase 数据库操作最佳实践 - 类型安全查询、RLS 策略、数据库设计
---

# Supabase Skill

## 数据库查询

### 安全的类型推断

```typescript
// ✅ 正确：使用类型断言
const { data }: any = await supabase
  .from('table')
  .select('*')
  .eq('user_id', user.id)

// ✅ 正确：使用 single<T>()
const { data: user } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single<User>()

// ❌ 错误：会导致 never 类型
const { data } = await supabase.from('table').select('*')
```

### Insert/Update 类型问题

当遇到 `never` 类型错误时，使用 `as any`：

```typescript
// Insert
await supabase
  .from('table')
  .insert({
    field1: value1,
    field2: value2,
  } as any)

// Update
await supabase
  .from('table')
  .update({
    field1: newValue,
  } as any)
  .eq('id', id)
```

## RLS 策略

- 所有用户表必须启用 RLS
- 创建策略时使用 `auth.uid()` 获取当前用户
- 常用模式：`CREATE POLICY "Users can view own data" ON table FOR SELECT USING (user_id = auth.uid());`

## 性能优化

- 使用 `.select('column1,column2')` 而非 `select('*')`
- 添加 `.limit()` 避免返回过多数据
- 使用 `.eq()` 索引列

## 常见错误处理

```typescript
const { data, error } = await supabase.from('table').select('*')

if (error) {
  console.error('Error:', error.message)
  return
}
```
